export const breadcrumbMap: { [key: string]: string } = {
  dashboard: 'Dashboard',
  products: 'Products',
  'new-product': 'New Product',
  'edit-product': 'Edit Product',
  category: 'List Category',
};

export const generateBreadcrumbs = (pathname: string) => {
  return pathname
    .split('/')
    .filter((segment) => segment)
    .map((segment, index, array) => ({
      label: breadcrumbMap[segment] || segment,
      path: '/' + [...array.slice(0, index + 1)].join('/'),
      isActive: index === array.length - 1,
    }));
};
