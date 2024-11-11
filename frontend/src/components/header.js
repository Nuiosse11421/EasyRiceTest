import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const navigateToCreateInspection = () => {
    router.push('/create-inspection');
  };

  const navigateToHistory = () => {
    router.push('/history');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 border-b border-gray-300">
      <div className="flex-1">
        <h1 className="text-xl font-bold text-black">EASYRICE TEST</h1>
      </div>
      <div className="flex gap-4">
        <button
          onClick={navigateToCreateInspection}
          className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
        >
          Create Inspection
        </button>
        <button
          onClick={navigateToHistory}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          History
        </button>
      </div>
    </header>
  );
}