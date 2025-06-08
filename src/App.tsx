import { Button } from "./components/common";

function App() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-black">Welcome to My App</h1>
      <p className="text-lg text-gray-700 mb-2">This is a simple React application styled with Tailwind CSS.</p>
      <Button />
    </div>
  )
}

export default App