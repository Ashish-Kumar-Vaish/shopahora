import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import User from "@/models/User";
import Address from "@/models/Address";
import Product from "@/models/Product";
import Order from "@/models/Order";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

async function migrate() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  let cached = global.mongoose;
  if (!cached) {
    cached = { conn: null, promise: null };
    global.mongoose = cached;
  }

  (async function () {
    if (cached!.conn) {
      return cached!.conn;
    }

    if (!cached!.promise) {
      cached!.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
        return mongoose;
      });
    }

    cached!.conn = await cached!.promise;
    return cached!.conn;
  })();

  // Table to track migration stats
  const stats = {
    users: { total: 0, successes: 0, failures: 0 },
    addresses: { total: 0, successes: 0, failures: 0 },
    products: { total: 0, successes: 0, failures: 0 },
    cartItems: { total: 0, successes: 0, failures: 0 },
    orders: { total: 0, successes: 0, failures: 0 },
  };

  // Map to store prices for historical order item generation
  const productPriceMap = new Map<string, number>();

  try {
    console.log("--- Migrating Users ---");
    const users = await User.find();
    stats.users.total = users.length;

    for (const u of users) {
      try {
        await prisma.user.upsert({
          where: { clerkId: u.clerkId },
          update: {
            name: u.name,
            email: u.email,
          },
          create: {
            id: u._id.toString(),
            clerkId: u.clerkId,
            name: u.name,
            email: u.email,
          },
        });

        stats.users.successes++;
      } catch (err) {
        console.error(`Failed to migrate user ${u._id}:`, err);
        stats.users.failures++;
      }
    }
    console.log(`Migrated ${stats.users.successes}/${stats.users.total} users`);

    const clerkIdToMongoId = new Map(
      users.map((u) => [u.clerkId, u._id.toString()]),
    );

    console.log("--- Migrating Addresses ---");
    const addresses = await Address.find();
    stats.addresses.total = addresses.length;

    for (const a of addresses) {
      try {
        const mongoUserId = clerkIdToMongoId.get(a.userId);
        if (!mongoUserId) {
          console.warn(
            `Skipping address ${a._id} - user ${a.userId} not found in MongoDB mapping`,
          );
          stats.addresses.failures++;
          continue;
        }

        const userExists = await prisma.user.findUnique({
          where: { id: mongoUserId },
          select: { id: true },
        });

        if (!userExists) {
          console.warn(
            `Skipping address ${a._id} — user ${mongoUserId} not found in Postgres`,
          );
          stats.addresses.failures++;
          continue;
        }

        const addressData = {
          userId: mongoUserId,
          fullName: a.fullName,
          phoneNumber: a.phoneNumber,
          area: a.area,
          city: a.city,
          state: a.state,
          zipCode: a.zipCode,
          country: a.country,
        };

        await prisma.address.upsert({
          where: { id: a._id.toString() },
          update: addressData,
          create: { id: a._id.toString(), ...addressData },
        });

        stats.addresses.successes++;
      } catch (err) {
        console.error(`Failed to migrate address ${a._id}:`, err);
        stats.addresses.failures++;
      }
    }
    console.log(
      `Migrated ${stats.addresses.successes}/${stats.addresses.total} addresses`,
    );

    console.log("--- Migrating Products ---");
    const products = await Product.find();
    stats.products.total = products.length;

    for (const p of products) {
      try {
        const productData = {
          name: p.name,
          price: Math.round(p.price),
          salePrice: p.salePrice ? Math.round(p.salePrice) : null,
          currency: p.currency || "USD",
          description: p.description,
          category: p.category,
          imageUrls: p.imageUrls ?? [],
          colors: p.colors ?? [],
          sizes: p.sizes ?? [],
          characteristics: p.characteristics || {},
          stock: p.stock ?? 0,
          isActive: p.isActive ?? true,
          highlight: p.highlight,
        };

        // Save to map for OrderItems later
        productPriceMap.set(p._id.toString(), p.salePrice || p.price);

        await prisma.product.upsert({
          where: { id: p._id.toString() },
          update: productData,
          create: { id: p._id.toString(), ...productData },
        });

        stats.products.successes++;
      } catch (err) {
        console.error(`Failed to migrate product ${p._id}:`, err);
        stats.products.failures++;
      }
    }
    console.log(
      `Migrated ${stats.products.successes}/${stats.products.total} products`,
    );

    const postgresProductIds = new Set(
      (await prisma.product.findMany({ select: { id: true } })).map(
        (p: any) => p.id,
      ),
    );

    console.log("--- Migrating Cart Items ---");
    for (const u of users) {
      if (!u.cartItems || typeof u.cartItems !== "object") {
        continue;
      }

      for (const [productId, quantity] of Object.entries(
        u.cartItems as Record<string, any>,
      )) {
        try {
          if (!postgresProductIds.has(productId)) {
            console.warn(
              `Skipping cart item for user ${u._id}: product ${productId} not found`,
            );
            continue;
          }

          // UPDATED: Using userId_productId and productId
          await prisma.cartItem.upsert({
            where: {
              userId_productId: {
                userId: u._id.toString(),
                productId: productId,
              },
            },
            update: {
              quantity: Number(quantity),
            },
            create: {
              userId: u._id.toString(),
              productId: productId,
              quantity: Number(quantity),
            },
          });

          stats.cartItems.successes++;
        } catch (err) {
          console.error(
            `Failed to migrate cart item (User: ${u._id}, Product: ${productId}):`,
            err,
          );
        }
      }
    }
    console.log(`Migrated ${stats.cartItems.successes} cart items`);

    console.log("--- Migrating Orders ---");
    const orders = await Order.find();
    stats.orders.total = orders.length;

    for (const o of orders) {
      try {
        const mongoUserId = clerkIdToMongoId.get(o.userId);
        if (!mongoUserId) {
          console.warn(
            `Skipping order ${o._id} - user ${o.userId} not found in MongoDB mapping`,
          );
          stats.orders.failures++;
          continue;
        }

        const userExists = await prisma.user.findUnique({
          where: { id: mongoUserId },
          select: { id: true },
        });

        // UPDATED: Fetch full address details from Mongo to create the JSON snapshot
        const addressDetails = await Address.findById(o.address);

        if (!userExists || !addressDetails) {
          console.warn(`Skipping order ${o._id}: User or Address data missing`);
          stats.orders.failures++;
          continue;
        }

        // UPDATED: Build the new Order object structure
        const orderData = {
          userId: mongoUserId,
          totalAmount: Math.round(o.amount),
          currency: "USD", // Defaulting to USD, adjust if you had dynamic currencies per order
          status: o.status as any,
          createdAt: o.date, // Preserving your original Mongo date
          addressSnapshot: {
            fullName: addressDetails.fullName,
            phoneNumber: addressDetails.phoneNumber,
            area: addressDetails.area,
            city: addressDetails.city,
            state: addressDetails.state,
            zipCode: addressDetails.zipCode,
            country: addressDetails.country,
          },
        };

        await prisma.$transaction(async (tx: any) => {
          await tx.order.upsert({
            where: { id: o._id.toString() },
            update: orderData,
            create: { id: o._id.toString(), ...orderData },
          });

          await tx.orderItem.deleteMany({
            where: { orderId: o._id.toString() },
          });

          for (const item of o.items) {
            const productIdStr = item.product.toString();

            if (postgresProductIds.has(productIdStr)) {
              // Fetch historical price from our map
              const unitPrice = productPriceMap.get(productIdStr) || 0;

              // UPDATED: Mapping to productId, unitPrice, and currency
              await tx.orderItem.create({
                data: {
                  orderId: o._id.toString(),
                  productId: productIdStr,
                  quantity: item.quantity,
                  unitPrice: Math.round(unitPrice),
                  currency: "USD",
                },
              });
            } else {
              console.warn(
                `OrderItem skip: product ${item.product} missing for order ${o._id}`,
              );
            }
          }
        });

        stats.orders.successes++;
      } catch (err) {
        console.error(`Failed to migrate order ${o._id}:`, err);
        stats.orders.failures++;
      }
    }
    console.log(
      `Migrated ${stats.orders.successes}/${stats.orders.total} orders`,
    );

    console.log("\nMIGRATION SUMMARY");
    console.table(stats);
  } catch (globalErr) {
    console.error("CRITICAL: Global migration error:", globalErr);
    throw globalErr;
  }
}

migrate()
  .catch((error) => {
    console.error("Migration failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().then(() => {
      console.log("Disconnected from Postgres");
    });
    await mongoose.disconnect().then(() => {
      console.log("Disconnected from MongoDB");
    });
    process.exit(0);
  });
