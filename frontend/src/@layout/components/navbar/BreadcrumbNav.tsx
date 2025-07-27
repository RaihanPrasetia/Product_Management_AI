import { useNavigate } from 'react-router-dom';

type BreadcrumbNavProps = {
  pathname: string;
};

const breadcrumbMap: { [key: string]: string } = {
  dashboard: 'Dashboard',
  products: 'Products',
  category: 'List Category',
  detail: 'Product Detail',
};

export default function BreadcrumbNav({ pathname }: BreadcrumbNavProps) {
  const navigate = useNavigate();

  const breadcrumbs = pathname
    .split('?')[0]
    .split('&')[0]
    .split('/')
    .filter((segment) => segment)
    .map((segment, index, array) => ({
      label: breadcrumbMap[segment] || segment,
      path: '/' + [...array.slice(0, index + 1)].join('/'),
      isActive: index === array.length - 1,
    }));

  return (
    <div className="flex flex-col text-gray-400">
      <div className="flex space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.path} className="flex items-center">
            {!breadcrumb.isActive ? (
              <button
                onClick={() => navigate(breadcrumb.path)}
                className="hover:text-gray-900 transition"
              >
                {breadcrumb.label.charAt(0).toUpperCase() +
                  breadcrumb.label.slice(1)}
              </button>
            ) : (
              <span className="text-gray-800 font-semibold">
                {breadcrumb.label.charAt(0).toUpperCase() +
                  breadcrumb.label.slice(1)}
              </span>
            )}
            {index < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
