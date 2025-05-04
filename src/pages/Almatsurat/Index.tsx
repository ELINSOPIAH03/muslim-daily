import NavbarHeader from "../../components/NavbarHeader"
import Footer from "../../components/Footer"

import pagiIcon from "../../assets/icons/ic-pagi.svg"
import petangIcon from "../../assets/icons/ic-petang.svg"

const data = [
    {
        id: 2,
        name: "Al-Ma'tsurat Pagi",
        href: '/al-matsurat/pagi',
        imageSrc: pagiIcon,
    },
    {
        id: 3,
        name: "Al-Ma'tsurat Petang",
        href: '/al-matsurat/petang',
        imageSrc: petangIcon,
    },
]

export default function Index() {
    return (
        <div className="bg-white">
            <NavbarHeader />

            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#A8C3A6] to-[#36A9E1] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                </div>
                <div className="mx-auto max-w-6xl py-20 sm:py-40 ">
                    <div className="mx-auto max-w-6xl">
                        <div className="mx-auto max-w-2xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 lg:gap-20">
                                {data.map((data) => (
                                    <a href={data.href}
                                        key={data.id}
                                        className="bg-white border border-gray-100 rounded-lg p-4 text-center shadow-sm hover:shadow-md hover:bg-sage-200 transition "
                                    >
                                        <img
                                            src={data.imageSrc}
                                            alt={data.name}
                                            className="mx-auto h-30 w-30 sm:h-50 sm:w-50 object-contain mb-4"
                                        />
                                        <p className="mt-8 text-lg font-medium text-pretty text-gray-900 sm:text-xl/8">
                                            {data.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-40rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#A8C3A6] to-[#36A9E1] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}