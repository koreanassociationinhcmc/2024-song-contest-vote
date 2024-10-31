import Link from 'next/link';

export default function AdminLink() {
  return (
    <div className="text-center mt-6">
      <Link 
        href="/admin/login" 
        className="text-gray-600 hover:text-gray-800 text-sm"
      >
        관리자 로그인
      </Link>
    </div>
  );
}