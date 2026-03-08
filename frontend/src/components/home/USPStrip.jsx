/**
 * Dải lợi ích (USP) dưới hero - icon + text, layout ngang
 */
import { USP_ITEMS } from '../../constants/homeConfig.js';

const Icon = ({ name }) => {
  if (name === 'truck') {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    );
  }
  if (name === 'gift') {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110 4h14a2 2 0 110-4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    );
  }
  if (name === 'return') {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  }
  return null;
};

export default function USPStrip() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-[88rem] mx-auto px-3 sm:px-4 lg:px-5 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center text-center">
          {USP_ITEMS.map((item) => (
            <div key={item.icon} className="flex flex-col items-center gap-2 text-gray-600">
              <Icon name={item.icon} />
              <span className="text-sm font-medium tracking-wide">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
