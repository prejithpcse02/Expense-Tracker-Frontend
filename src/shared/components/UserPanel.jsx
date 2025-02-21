export default function UserPanel({ userId }) {
  return (
    <aside className="w-64 bg-gray-800 h-full p-4">
      <h2 className="text-lg font-semibold">User Info</h2>
      <p className="text-gray-400">User ID: {userId}</p>
      {/* Fetch and display more user details here */}
    </aside>
  );
}
