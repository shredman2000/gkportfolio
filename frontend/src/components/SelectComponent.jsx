import React from 'react';
import Select, { components } from 'react-select';

const MovieSelect = ({ value, onChange }) => {
  const options = [
    { value: 'Action', label: 'Action' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Animation', label: 'Animation' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Crime', label: 'Crime' },
    { value: 'Documentary', label: 'Documentary' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Family', label: 'Family' },
    { value: 'History', label: 'History' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Music', label: 'Music' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Science Fiction', label: 'Sci-fi' },
    //{ value: 'TV Movie', label: 'TV Movie' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'War', label: 'War' },
    { value: 'Western', label: 'Western' },

  ];

  const CustomMenuList = (props) => (
    <components.MenuList {... props}>
        <div style={{
            display: 'grid',
            width: 300,
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '8px',
            padding: '8px',
        }}>{props.children}</div>
    </components.MenuList>
  )
  const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: 250,
        height: 50,
        borderRadius: 8,
        border: 'none',
        boxShadow: 'none',
        backgroundImage: "url('/Genre-button.png')", 
        backgroundSize: 'cover',  
        overflow: 'hidden',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'transparent',
        backgroundPosition: 'center',
        cursor: 'pointer',
        padding: 0,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      display: 'none'
    }),
    indicatorSeparator: () => ({
      display: 'none', // gets rid of vertical line
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#2C3333' : state.isFocused ? '#D1ECE9' : '#E7F6F2',
      color: state.isSelected ? '#E7F6F2' : state.isFocused ? '#2C3333' : '#2C3333',
      padding: 10,
      borderRadius: 5
    }),
    menu: (provided) => ({
      ...provided,
      width: 'auto',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#395B64',
      padding: 10,
      left: '50%',
      transform: 'translateX(-50%)',
      
    }),
    menuList: (provided) => ({
        ...provided,
        maxHeight: 'none',
        maxWidth: 'none',
        overflow: 'visible'
    })
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      styles={customStyles}
      components={{ MenuList: CustomMenuList }}
      placeholder=''
      isSearchable={false}
      controlShouldRenderValue={false}
    />
  );
};

export default MovieSelect;
