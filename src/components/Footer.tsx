import { Link } from 'react-router-dom';
import logoImage from "../assets/images/md.png";
import IgIcon from "../assets/icons/ic-ig.svg";
import GithubIcon from "../assets/icons/ic-github.svg";
import LinkedinIcon from "../assets/icons/ic-linkedin.svg";

const navigation = [
    { name: 'Home', href: '/' },
    { name: "Al-Qur'an", href: '/al-quran' },
    { name: "Al-Ma'tsurat", href: '/al-matsurat' },
    { name: 'Contact', href: '#' },
];

export default function Footer() {
    return (
        <footer className="w-full py-14 bg-sage-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <a href="" className="flex justify-center ">
                        <img 
                            className="mx-auto h-15 w-auto" 
                            src={logoImage}
                            alt="Your Company"
                        />
                    </a>
                    <ul className="text-lg flex items-center justify-center flex-col gap-7 md:flex-row md:gap-12 transition-all duration-500 py-16 mb-10 border-b border-gray-200">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link 
                                    to={item.href} 
                                    className="text-gray-800 font-semibold hover:text-gray-900"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex space-x-10 justify-center items-center mb-14">
                        <div className="block  text-gray-900 transition-all duration-500 hover:text-indigo-600 ">
                            <a href="https://github.com/elinsopiah03" 
                                className="block  text-gray-900 transition-all duration-500 hover:text-indigo-600 "
                                target='_blank'>
                                <img src={GithubIcon}
                                    alt="404"
                                    className='w-[1.688rem] h-[1.688rem]' />
                            </a>
                        </div>
                        <div className="block  text-gray-900 transition-all duration-500 hover:text-indigo-600 ">
                            <a href="https://www.instagram.com/_.arifaah/" 
                                className="block  text-gray-900 transition-all duration-500 hover:text-indigo-600 " 
                                target="_blank">
                                <img src={IgIcon}
                                    alt="404"
                                    className='w-[1.688rem] h-[1.688rem]' />
                            </a>
                        </div>
                        <div className="block  text-gray-900 transition-all duration-500 hover:text-indigo-600 ">
                            <a href="https://www.linkedin.com/in/elin-sopiah/" 
                                className="block  text-gray-900 transition-all duration-500 hover:text-indigo-600 "
                                target="_blank">
                                <img src={LinkedinIcon}
                                    alt="404"
                                    className='w-[1.688rem] h-[1.688rem]' />
                            </a>
                        </div>
                    </div>
                    <span className="text-lg text-gray-500 text-center block">©<Link to="">Muslim Daily</Link>
                        2025, All rights reserved.</span>
                </div>
            </div>
        </footer>

    )
}