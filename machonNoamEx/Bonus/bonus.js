var isClose=true;

function OpenOrClose()
{
   if(isClose)
    {
        $('#sdarotDetails').show("slide", { direction: "down" }, 2000);
        $('#arrowId').attr("src", "arrowDownImg.png");
    }
    else
    {
         $('#sdarotDetails').hide("slide", { direction: "down" }, 2000);
         $('#arrowId').attr("src", "arrowLeftImg.png");
    }
    isClose=!isClose;
}