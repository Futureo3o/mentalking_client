"use client";

import DBIntroduceTrans from "@/utils/DBIntroduceTrans";
import DBMentorTrans from "@/utils/DBMentorTrans";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect, useState } from "react";
import styles from "./with.module.scss"
import { useUserContext } from "@/context/UserContext";
import Modal from "@/components/Modal";
import { GoHeart, GoHeartFill } from "react-icons/go";

interface PageProps {
    params : Promise<{id : string}>;
}

const With : React.FC<PageProps> =  ({params}) => {

    const { id } = use(params);
    const [profile, setProfile] = useState<IntroduceProfile>();
    const router = useRouter();
    const { user, userType, checkAccessToken, logOut } = useUserContext();
    const [showModal, setShowModal] = useState(false);
    const [isFavorited, setIsFavorited] = useState<boolean>();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const mentor = profile?.mentor;
    const introduce = profile?.introduce;

    const handleWanted = (id: string) => {
        router.push(`/wanted/${id}`);
    }

    const addFavorite = async () => {
        try {
            await axios.post(`${API_URL}/favorite/${id}`, { mentee_id: user?.id });
            setIsFavorited(true);
            console.log("즐겨찾기 추가");
        } catch (error) {
            console.log(error);
        }
    }

    const delFavorite = async () => {
        try {
            await axios.delete(`${API_URL}/favorite/${id}`, { data: { mentee_id: user?.id } });
            setIsFavorited(false);
            console.log("즐겨찾기 삭제");
        } catch (error) {
            console.log(error);
        }
    }

    const handleFavorite = async () => {
        try {
            checkAccessToken();
            if (userType === "mentee") {
                if (isFavorited) delFavorite();
                else addFavorite();
            } else if (userType === "mentor") {
                setShowModal(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/introduce/${id}`);
                const data = res.data;

                setProfile({
                    mentor: DBMentorTrans(data),
                    introduce: DBIntroduceTrans(data),
                });                
            } catch (error) {
                console.log(error);
            }
        };

        const checkFavorite = async () => {
            try {
                const res = await axios.get(`${API_URL}/favorite/${id}/${user?.id}`);
                setIsFavorited(res.data.check);

            } catch (error) {
                console.log(error);
            }
        }

        fetchProfile();
        checkFavorite();
    }, [id, isFavorited]);

    return (
        <main style={{flexDirection:"column", justifyContent:"flex-start", paddingTop:"0"}}>
            {showModal && (
                <Modal
                    title="접근 오류"
                    content="멘티만 이용할 수 있습니다. 로그아웃 하시겠습니까?"
                    onConfirmClick={() => {
                        logOut;
                        setShowModal(false);
                        router.push("/login");
                    }}
                    onCancelClick={() => setShowModal(false)}
                />
            )}
                <div className={styles.profileWrap}>
                    <div className={styles.topContainer}>
                        <div className={styles.imgFrame}>
                            <img
                                src={
                                    mentor?.profileImg
                                    ? `${API_URL}/${mentor.profileImg}`
                                    : "/images/default_profile.png"
                                }
                            />
                        </div>              
                        <div className={styles.profileContainer}>
                            <p className={styles.nickname}>{mentor?.nickname}</p>
                            <p>{mentor?.company}</p>
                            <div className={styles.careerContainer}>
                                <p>{mentor?.position}</p>
                                <span className={styles.span}>|</span>
                                <p>{mentor?.career}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.bottomContainer}>
                        <div className={styles.countContainer}>
                            <p>커피챗 {introduce?.coffeechatCount}회</p>
                            <span className={styles.span}>|</span>
                            <p>리뷰 {introduce?.reviewCount}개</p>
                            <span className={styles.span}>|</span>
                            <p>⭐ {introduce?.rating}</p>
                        </div>
                        <div className={styles.rightItems}>
                            <div className={styles.favorite}>
                                <GoHeart/>
                                <p>{mentor?.favoriteCount}</p>
                            </div>
                            <button onClick={() => handleWanted(id)}>커피챗 제안하기</button>
                        </div>
                    </div>
                </div>
            <div>
                <div>제목{introduce?.title}</div>
                <div>태그
                    {introduce?.tag.map((tag, index) => (
                        <div key={index} className={styles.tagFrame}>{tag}</div>
                    ))}
                </div>
                <div>내용{introduce?.content}</div>
            </div>
            <div className={styles.favorite} onClick={handleFavorite}>즐겨찾기 추가</div>
        </main>
    )
}

export default With;
