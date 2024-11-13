export default function Footer() {
  return (
    <footer className="flex items-center justify-center w-full h-24 border-t">
      <div className="flex items-center justify-center">
        <p className="text-sm text-gray-600">
          Copyright &copy; {new Date().getFullYear()} Izeek. All rights reserved - made by Jhomari
          Amaro
        </p>
      </div>
    </footer>
  )
}
