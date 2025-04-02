import CardLane from "@/components/CardLane"


const DashboardDetails = () => {
    const statusLanes = [{title:'Todo'}, {title:'In-progress'}, {title:'Done'}]


    return (
        <div className="container grid grid-cols-5 gap-4 mx-auto">
            {statusLanes.map((lane) => (
                <CardLane key={lane.title} title={lane.title}/>
            ))}
        </div>
    )
}


export default DashboardDetails