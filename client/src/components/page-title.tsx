function PageTitle({title} : {
    title : string
}) {
  return (
        <h1 className="text-primary text-xl font-bold mb-4">
          {title}
        </h1>
  )
}

export default PageTitle