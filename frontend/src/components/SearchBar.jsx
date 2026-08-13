function SearchBar({ value, onChange, onSearch, placeholder = 'Search by company or job title...' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="d-flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="btn btn-outline-primary">Search</button>
    </form>
  );
}

export default SearchBar;
