

function TagDisplay({ tags, onTagClick, tagColor, message }) {
    if (!tags.length) {
        return (
            <>
                <p className="text-gray-500">{message}</p>
            </>
        )
    }
    return (
        <>
            {
                tagColor === "blue" ?

                    tags.map(tag => (
                        <span key={tag.id} onClick={() => onTagClick(tag)} className={`inline-block bg-${tagColor}-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer`}>
                            {/* <span key={tag.id} onClick={() => onTagClick(tag)} className={`inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer`}> */}
                            {tag.name} ×
                        </span>
                    ))
                    :
                    tagColor === "red"
                        ?
                        tags.map(tag => (
                            <span key={tag.id} onClick={() => onTagClick(tag)} className={`inline-block bg-red-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer`} >
                                {tag.name} +
                            </span >
                        ))
                        :
                        tagColor === "lime"
                            ?
                            tags.map(tag => (
                                // <span key={tag.id} onClick={() => onTagClick(tag)} className={`inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer`} >
                                <span key={tag.id} className={`inline-block bg-${tagColor}-500 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer`} >
                                    {tag.name}
                                </span >
                            ))
                            : null

            }
        </>
    );
}
export default TagDisplay