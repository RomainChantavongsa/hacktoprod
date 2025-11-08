export default function Input({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}) {
  return (
    <div className="w-full group">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-primary-600">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-3 border-2 rounded-xl bg-white focus:ring-4 focus:ring-primary-200 focus:border-primary-500 outline-none transition-all duration-300 hover:border-primary-300 shadow-sm hover:shadow-md ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 animate-pulse">{error}</p>
      )}
    </div>
  );
}
