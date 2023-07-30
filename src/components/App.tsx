import React, { FC, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { RootState } from "../../redux/store";
import { ISpot } from "../../redux/spotsReducer";
import { getSpots, getCategories } from "../../redux/actions";
import { Button, Carousel, Space, Tag } from "antd";
import { GlobalStyle, Wrapper, ButtonsWrapper, ContentStyle } from "./App.styles";
import { ICategory } from "../../redux/categoriesReducer";

const App: FC = () => {

    const dispatch = useDispatch();
    const spots = useSelector((state: RootState) => state.spotsReducer);
    const categories = useSelector((state: RootState) => state.categoriesReducer);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCategoriesBtnDisabled, setCategoriesBtnDisabled] = useState(false);
    const [isSpotsBtnDisabled, setSpotsBtnDisabled] = useState(false);

    const url = "http://localhost:8080/api/";
    const fetchData  = async (query: string, action: (data: any) => AnyAction, isBtnDisabled: boolean, setBtnDisabled: React.Dispatch<React.SetStateAction<boolean>>) => {
        setIsLoading(true);
        try {
            if (!isBtnDisabled) {
                const response = await axios.get(`${url}${query}`);
                dispatch(action(response.data.data));
                setBtnDisabled(true);
            }
        } catch (err) {
            setErrorMessage(err);
        } finally {
            setIsLoading(false);
            setErrorMessage("");
        }
    }

    return (
        <>
            <GlobalStyle />
            <Wrapper>
                <h1>Не знаешь, где отдохнуть этим летом?</h1>
                <ButtonsWrapper>
                    <Button
                        onClick={ () => fetchData("categories", getCategories, isCategoriesBtnDisabled, setCategoriesBtnDisabled) }
                        disabled={ isCategoriesBtnDisabled }
                    >
                        Хочу узнать категории!
                    </Button>
                    <Button
                        onClick={ () => fetchData("spots", getSpots, isSpotsBtnDisabled, setSpotsBtnDisabled) }
                        disabled={ isSpotsBtnDisabled }
                    >
                        Куда поехать?
                    </Button>
                </ButtonsWrapper>
                <Carousel autoplay>
                    {
                        isLoading
                            ? <p>Загрузка...</p>
                            : spots.length > 0
                                && spots.map((spot: ISpot) => (
                                    <div key={ spot.id }>
                                        <h2>{ spot.country }</h2>
                                        <ContentStyle style={{ background: "#364d79" }}>
                                            { spot.name }
                                        </ContentStyle>
                                    </div>))
                    }
                </Carousel>
                {
                    categories.length > 0
                        && <div>
                            <h2>Категории:</h2>
                            {
                                categories.map((category: ICategory) => (
                                    <Space size={[0, 8]} wrap key={ category.id }>
                                        <Tag color="geekblue">{ category.name }</Tag>
                                    </Space>))
                            }
                        </div>
                }
                { errorMessage && <p>{ errorMessage }</p> }
            </Wrapper>
        </>
    )
}

export default App;