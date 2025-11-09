export default function CareerStatus({ status }: { status: string }) {
    let backgroundColor = "#F5F5F5";
    let borderColor = "#E9EAEB";
    let dotColor = "#717680";
    let textColor = "#414651";
    let text = "Unpublished";

    if (status === "active") {
        backgroundColor = "#ECFDF3";
        borderColor = "#A6F4C5";
        dotColor = "#12B76A";
        textColor = "#027948";
        text = "Published";
    } else if (status === "draft") {
        text = "Draft";
    } // 'inactive' uses the default gray style

    return (
        <div style={{ 
            borderRadius: "60px", 
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "5px", 
            padding: "0px 8px", 
            backgroundColor,
            border: `1px solid ${borderColor}`,
            }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: dotColor }}></div>
        <span style={{ fontSize: "12px", fontWeight: 700, color: textColor }}>
            {text}
        </span>
        </div>
    )
}