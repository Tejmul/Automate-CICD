export function CategoryChips({ categories, value, onChange }) {
    return (
        <div className="chips">
            <button
                className={`chip ${value === null ? 'chip--active' : ''}`}
                type="button"
                onClick={() => onChange(null)}
            >
                All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`chip ${value === cat ? 'chip--active' : ''}`}
                    type="button"
                    onClick={() => onChange(cat === value ? null : cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    )
}
