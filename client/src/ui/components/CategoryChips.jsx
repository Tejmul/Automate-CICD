export function CategoryChips({ categories, value, onChange }) {
    return (
        <div className="chips" role="tablist" aria-label="Categories">
            <button
                type="button"
                className={value ? 'chip' : 'chip chip--active'}
                onClick={() => onChange?.(null)}
            >
                All
            </button>
            {categories.map((c) => (
                <button
                    key={c}
                    type="button"
                    className={value === c ? 'chip chip--active' : 'chip'}
                    onClick={() => onChange?.(c)}
                >
                    {String(c).replace(/-/g, ' ')}
                </button>
            ))}
        </div>
    )
}

