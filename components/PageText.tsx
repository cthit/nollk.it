interface PageTextProps {
    children?: React.ReactNode
}

const PageText = (props: PageTextProps) => {
    return (
        <div className="lg:w-[40vw] font-light text-justify">
            {props.children}
        </div>
    )
}

export default PageText