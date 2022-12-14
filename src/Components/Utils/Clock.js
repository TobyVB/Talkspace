export default function Clock(props){


    let day;
    let timeOfDay;
    if(props.createdAt){
        day = props.createdAt.toDate().toDateString()
        timeOfDay = props.createdAt.toDate().toLocaleTimeString()
    }
    
    
    return (
        <div className={`time ${props.messageClass} ${props.type==='reply'?' time-reply':' time-comment'}`}>
            <p>{day}</p>
            <p>{timeOfDay}</p>
        </div>
    )
}