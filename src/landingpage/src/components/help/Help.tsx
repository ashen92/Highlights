'use client';

import * as React from 'react';
import './Help.scss';
import Image from 'next/image';
import Img1 from '../../assests/help1.png';
import { TbChecks } from "react-icons/tb";
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Help: React.FC = () => {
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

    return (
        <section>
            <div className='help1_container wrapper'>
                <div className='help1_top'>
                    <h3>Guidance for every step of your productivity enhancement journey...</h3>
                </div>
                <div className='help1_bottom'>
                    <Image src={Img1} alt="Help"></Image>
                </div>
            </div>
            <div className='help2_container wrapper'>
                <div className='help2_top' data-aos="fade-up">
                    <h3>Beginner&apos;s Guide</h3>
                </div>
                <div className='help2_bottom' data-aos="fade-left">
                    <div className='box'>
                        <h4>Account creation</h4>
                        <ul>
                            <li><TbChecks /> Click on Sign Up button</li>
                            <li><TbChecks /> Fill in the registration form</li>
                            <li><TbChecks /> Check your inbox for a verification email and click the link to verify your account</li>
                            <li><TbChecks /> Login using email and the password</li>
                        </ul>
                    </div>
                    <div className='box'>
                        <h4>Dashboard View</h4>
                        <ul>
                            <li><TbChecks /> View and manage your daily highlights</li>
                            <li><TbChecks /> Access the Pomodoro timer</li>
                            <li><TbChecks /> Sync with Google Tasks and Google Calendar</li>
                            <li><TbChecks /> Track your productivity statistics</li>
                        </ul>
                    </div>
                    <div className='box'>
                        <h4>Managing Highlights</h4>
                        <ul>
                            <li><TbChecks /> Click the Add Highlight button</li>
                            <li><TbChecks /> Fill in the highlight name, label, duration, time slot, and priority level.</li>
                            <li><TbChecks /> Click Save to add the highlight to your list</li>
                            <li><TbChecks /> For delete or edit; select the Highlight</li>
                            <li><TbChecks /> Click on Delete or Edit button</li>
                        </ul>
                    </div>
                </div>
                <div className='help2_bottom' data-aos="fade-right">
                    <div className='box'>
                        <h4>Managing Projects</h4>
                        <ul>
                            <li><TbChecks /> Click on projects in the side bar</li>
                            <li><TbChecks /> Create a project</li>
                            <li><TbChecks /> Create sub highlights within the project</li>
                            <li><TbChecks /> Assign a user for each highlight</li>
                            <li><TbChecks /> Share the project</li>
                            <li><TbChecks /> View the progress</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='help2_cotainer wrapper' >
                <div className='help2_top' data-aos="fade-up">
                    <h3>Features Guide</h3>
                </div>
                <div className='help2_bottom' data-aos="fade-up">
                    <div className='box'>
                        <h4>Pomodoro Timer</h4>
                        <ul>
                            <li><TbChecks /> Select a highlight from the list</li>
                            <li><TbChecks /> Click the Start Timer button to begin a 25-minute work session</li>
                            <li><TbChecks /> After 25 minutes, take a 5-minute break</li>
                            <li><TbChecks /> Go to the Pomodoro page to see your completed sessions</li>
                            <li><TbChecks /> Check the number of sessions completed and your productivity trends</li>
                        </ul>
                    </div>
                    <div className='box'>
                        <h4>Calendar View</h4>
                        <ul>
                            <li><TbChecks /> Go to calendar view page</li>
                            <li><TbChecks /> Highlights on the current day is displayed</li>
                            <li><TbChecks /> Click on month to view the highlights of upcoming 30 days</li>
                            <li><TbChecks /> Click on year to glimpse on the task of upcoming 12 months</li>
                        </ul>
                    </div>
                    <div className='box'>
                        <h4>Daily Tips</h4>
                        <ul>
                            <li><TbChecks /> When you login, you will get a popup box</li>
                            <li><TbChecks /> Click on view button</li>
                            <li><TbChecks /> Explore general tips</li>
                            <li><TbChecks /> Explore tips on your recommendations</li>    
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Help;