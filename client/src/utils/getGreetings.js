export const getGreetings = () =>
{
    const time = new Date().getHours;
    if(time<12)
        return "Good Morning";
    else if (time < 17)
        return "Good afternoon";
    else    
        return "Good Evening";
}