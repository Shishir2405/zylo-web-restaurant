import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function Earnings() {
  // Sample earnings data
  const earnings = Array(1).fill({
    id: "112345",
    customer: "Eren Jaegar",
    payment: "$125",
    commission: "$25",
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="earnings" />

      <div className="flex-1">
        <Header title="Earnings" />

        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Total Payment
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Zylo commission
                  </th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((earning, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="p-4">{earning.id}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#f8b133] bg-opacity-30 flex items-center justify-center mr-3">
                          <span className="text-xs text-[#f8b133]">EJ</span>
                        </div>
                        <span>{earning.customer}</span>
                      </div>
                    </td>
                    <td className="p-4">{earning.payment}</td>
                    <td className="p-4">{earning.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
