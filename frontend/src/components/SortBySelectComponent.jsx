import React from 'react';
import Select, { components } from 'react-select';


const SortBySelectComponent = ({ value, onChange }) => {
    const options = [
        { value: 'audience-rating', label: "Audience Rating"},
        { value: 'gunnar-rating', label: "Gunnar's Rating" }
    ]

    const CustomMenuList = (props) => (
        <components.MenuList {... props}>
            <div style={{
                display: 'flex',
                width: 'auto',
                flexDirection: 'row',
                gap: '8px',
                padding: '8px',
                zIndex: 1000,
            }}>{props.children}</div>
        </components.MenuList>
    )
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: 150,
            height: 30,
            borderRadius: 8,
            border: 'none',
            boxShadow: 'none',
            backgroundImage: "url('/Select-Component-Background.png')", 
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
            color: '#A5C9CA',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#A5C9CA',

        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            display: 'none'
        }),
        indicatorSeparator: () => ({
            display: 'none', 
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#2C3333' : state.isFocused ? '#D1ECE9' : '#E7F6F2',
            color: state.isSelected ? '#E7F6F2' : state.isFocused ? '#2C3333' : '#2C3333',
            padding: 10,
            borderRadius: 5,
            textAlign: 'center',
            width: '50%'
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
            zIndex: 9999
            
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: 'none',
            maxWidth: 'none',
            overflow: 'visible'
        }),
        menuPortal: (provided) => ({ 
            ...provided,
            zIndex: 9999,
        }),
    };
    return (
        <Select
            value={value}
            onChange={onChange}
            options={options}
            styles={customStyles}
            components={{ MenuList: CustomMenuList }}
            placeholder='Sort By...'
            isSearchable={false}
            menuPortalTarget={document.body}
        />
    );

}
export default SortBySelectComponent;