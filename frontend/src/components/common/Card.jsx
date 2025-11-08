export default function Card({ children, className = '', title, actions }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-1 ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          {title && <h3 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
