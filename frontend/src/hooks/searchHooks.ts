// src/hooks/SearchHooks.ts
import { useState } from 'react';

const SearchHooks = () => {
  const [searchString, setSearchString] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return { searchString, handleSearchChange };
};

export default SearchHooks;
