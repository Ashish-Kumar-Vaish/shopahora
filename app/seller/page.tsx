"use client";

import { useAppContext } from "@/contexts/AppContext";

const Seller = () => {
  const { userData } = useAppContext();

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {userData?.name}
          </h2>
          <p className="text-gray-700">
            Here you can manage your products, view orders, and track sales.
          </p>
        </div>

        <div className="p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>

          <ul className="list-disc list-inside custom-marker-size text-gray-700">
            <li>Add new products</li>
            <li>View product list</li>
            <li>Manage orders</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Seller;
