"use client"

import axios from "axios";
import { useEffect, useState } from "react";

export default function useUserData () {

    const [introduce, setIntroduce] = useState<Introduce | null>(null);
 
    useEffect(() => {
        const cookie = {
            type: "Mentor",
            id:"test3",

            // type:"Mentee",
            // id : "ju1asd3111"
        }

        async function fetchIntroduceData () {
            await axios.get(`http://localhost:8080/intro/${cookie.id}`).then((result) => {

                const introduce = result.data;

                const newIntroduce = {
                    mentorId : introduce.mentor_id,
                    title : introduce.mentor_title,
                    content :introduce.mentor_content,
                    reviewCount : introduce.review_count,  
                    coffeechatCount : introduce.coffeechat_count,
                    rating : introduce.mentor_rating,
                }

                setIntroduce(newIntroduce);
            })


        }

        fetchIntroduceData();
       
    }, [])

    
    return introduce;
    
}

