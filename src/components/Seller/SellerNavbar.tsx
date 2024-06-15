import MaxWidthWrapper from "./MaxWidthWrapper"
import SellerNavItems from "./SellerNavItems"


const SellerNavbar = () => {
    const user = null

    return (
        <div className="bg-white sticky z-50 top-0 inset-x-0 h-16 text-gray-500">
            <header className="relative bg-white">
                <MaxWidthWrapper>
                    <div className="border-b border-gray-500">
                        <div className="flex h-16 justify-center">
                            <div className="z-50 lg:ml-8 lg:block lg:self-stretch">
                                <SellerNavItems />
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </header>
        </div>
    )
}

export default SellerNavbar