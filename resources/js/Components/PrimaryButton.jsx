export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={`w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex justify-center items-center transition-all duration-150 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
