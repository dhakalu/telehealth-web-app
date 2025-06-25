export type AvatarProps = {
    initials?: string;
    src?: string;
    width?: number;
}

export const Avatar = ({ initials, src }: AvatarProps) => {

    return (
        <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 overflow-hidden">
                {initials
                    ? (
                        <span className="w-full h-full text-xl font-bold text-gray-700 flex items-center justify-center">
                            {initials}
                        </span>
                    )
                    : (
                        <img alt="Profile" src={src} className="w-full h-full object-cover" />
                    )
                }
            </div>
        </div>
    )
}