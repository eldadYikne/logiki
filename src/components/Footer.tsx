export default function Footer() {
  return (
    <footer
      dir="ltr"
      className="bg-white rounded-lg shadow dark:bg-gray-900 m-4"
    >
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            CodeWithUs
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
