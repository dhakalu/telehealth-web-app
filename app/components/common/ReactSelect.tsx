import Select from 'react-select';


export interface ReactSelectProps {
    label?: string;
    name: string;
    options: { value: string; label: string }[];
    value?: { value: string; label: string };
    onChange?: (selectedOption: { value: string; label: string } | null) => void;
}

export default function ReactSelect({ options, label, name, value, onChange }: ReactSelectProps) {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <Select
                name={name}
                options={options}
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
                isSearchable
                placeholder="Select an option"
                onChange={onChange}
                value={value || null}
                styles={{
                    control: (base) => ({
                        ...base,
                        color: 'var(--text-color)',
                        borderColor: 'var(--bg-base)',
                        boxShadow: 'none',
                        background: 'var(--bg-base)',
                        '&:hover': {
                            borderColor: 'var(--border-color)',
                        },
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? 'var(--fallback-p,oklch(var(--p)/1))' : 'transparent',
                        color: state.isFocused ? 'var(--fallback-pc,oklch(var(--pc)/1))' : 'var(--fallback-bc,oklch(var(--bc)/1))',
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: 'var(--bg-base)',
                        borderColor: 'var(--border-color)',
                        zIndex: 9999, // Ensure the dropdown is above other elements
                    }),
                }}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: 'var(--primary-color)',
                        neutral0: 'var(--background-color)',
                        neutral20: 'var(--border-color)',
                        neutral30: 'var(--text-color)',
                    },
                })}
            />
        </div>
    );
}
