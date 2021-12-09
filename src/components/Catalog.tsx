import React from 'react';
import { useSelector } from 'react-redux';

const Catalog: React.FC = () => {
  const catalog = useSelector(store => store);

  console.log(catalog);

  return (
    <h2>Catalog</h2>
  );
};

export default Catalog;