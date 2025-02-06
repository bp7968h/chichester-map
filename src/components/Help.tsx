import React from "react";
import { Icons } from "@/components/ui/icons";

interface HelpProps {
    onClick: () => void,
}

const Help: React.FC<HelpProps> = ({onClick}) => {
    return (
        <div className="absolute top-4 right-8">
            <Icons.helper onClick={() => onClick()} className="cursor-pointer"/>
        </div>
    )
}

export default Help;