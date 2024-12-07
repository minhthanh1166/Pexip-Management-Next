export const data = [
  {
    name: "LabMeeting",
    ip_address: "10.9.30.16",
    pin: "54321",
  },
  {
    name: "LabMeeting2",
    ip_address: "10.9.30.16",
    pin: "",
  },
];

export default function MeetingList() {
  return (
    <div className="bg-gray-300 p-3 w-full h-screen">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full h-full p-6">
        <h3 className="font-semibold text-xl mb-6">Meeting List</h3>
        <div className="lg:w-9/12 h-full mx-auto overflow-x-scroll">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3 float-right">
            <i className="fas fa-plus me-2"></i>
            Create Meeting
          </button>
          <table className="w-full mx-auto table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Ip Address
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Pin
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.ip_address}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.pin ? (
                      item.pin
                    ) : (
                      <span className="text-red-500">No Pin</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {/* button edit and delete */}
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
                      <i className="fas fa-edit me-2"></i>
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2">
                      <i className="fas fa-trash me-2"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
