

export default function Clock(props){

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // const foundTime = new Date(props.createdAt * 1)
    // const year = foundTime.getYear()
    // const yearShortened = JSON.stringify(year).slice(1, 3)
    // const month = monthNames[foundTime.getMonth()+1]
    // const day = foundTime.getDay()
    // const hour = foundTime.getHours()
    // const minutes = foundTime.getMinutes()
    // // const timeOfDay = foundTime.getTime()
    // if (minutes.length === 1){minutes = JSON.stringify(minutes)+"0"}

    // const time = `${month}/${day}/${yearShortened} ${hour}:${minutes}`
    // // const time = foundTime;


    let day;
    let timeOfDay;
    if(props.createdAt){
        day = props.createdAt.toDate().toDateString()
        timeOfDay = props.createdAt.toDate().toLocaleTimeString()
    }
    
    
    return (
        <div className={`time ${props.messageClass}`}>
            <p>{day}</p>
            <p>{timeOfDay}</p>
        </div>
    )
}