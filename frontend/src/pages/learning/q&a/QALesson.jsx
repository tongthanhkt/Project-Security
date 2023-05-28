import { useState } from "react";
import { Avatar } from "../../../components/Avatar";
import BasicButton from "../../../components/button/BasicButton";
import { BasicEditor } from "../../../components/input/BasicEditor";
import { PaginatedCommentList } from "./PaginatedCommentList";

export const QALesson = () => {
  const data = [
    {
      arvatarUrl:
        "https://hollywoodzam.com/wp-content/uploads/2021/05/Takao-Akizuki-3.jpg",
      userName: "Trương Anh Ngọc",
      content: "Tin chuẩn nhé em",
      timestammp: "12:30",
      hasAnswer: true,
    },
    {
      arvatarUrl:
        "https://hollywoodzam.com/wp-content/uploads/2021/05/Takao-Akizuki-3.jpg",
      userName: "Trương Anh Ngọc",
      content: `Many of you keep repeating the sentence "Is it true, brother?", wanting to know "Is it true?" then compare, read other news sources, read newspapers. If I read a news and still feel like "Ah, I can't believe it", I have to look elsewhere instead of asking the same question over and over again like a cow, "Is it true?" I'm going to laugh haha ​​and then I'll write my miscellaneous things above. So instead of that, you guys should do this for yourself, go look, read in other newspapers, read on other fanpages, know English to understand foreign news sources instead of just going. asked "Is the news correct?", everyone who came in asked: "Is it true?" I either deleted it, or blocked it all. I don't like this, if you don't believe in anything, even if you don't believe me, you can unfollow me, don't follow my fanpage, but never ask a question "Is it true? ?", not cool at all, guys! One is to block, the other is to delete, there is no such thing as repeating the same sentence as "Is it true, brother?".`,
      timestammp: "12:30",
      hasAnswer: false,
    },
    {
      arvatarUrl:
        "https://hollywoodzam.com/wp-content/uploads/2021/05/Takao-Akizuki-3.jpg",
      userName: "Trương Anh Ngọc",
      content: `Muitos de vocês ficam repetindo a frase "É verdade, irmão?", Querendo saber "É verdade, irmão?" depois compare, leia outras fontes, leia jornais. Se eu leio uma notícia e ainda sinto como "Ah, eu não posso acreditar", então eu tenho que procurar em outro lugar em vez de fazer a mesma pergunta repetidas vezes como uma vaca, "É verdade?" Eu vou para rir haha ​​​​e depois vou escrever minhas coisas diversas acima. Então ao invés disso, por favor, faça isso por você mesmo, vá procurar, leia em outros jornais, leia em outras fanpages, saiba inglês para entender fontes estrangeiras ao invés de apenas ir. perguntou "A notícia está correta?", todos que entraram perguntaram: "É verdade?" Eu apaguei ou bloqueei tudo. Não gosto disso, se você não acredita em nada, mesmo que não acredite em mim, pode deixar de me seguir, não seguir minha fanpage, mas nunca faça uma pergunta do tipo "É verdade? ?" , nada legal, pessoal! Uma é bloquear, a outra deletar, não tem como ficar repetindo a mesma frase indefinidamente como "É verdade, irmão?`,
      timestammp: "12:30",
      hasAnswer: false,
    },
  ];

  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const [listComment, setListComment] = useState(data);
  const [pageCount, setPageCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [isDirtyEditor, setIsDirtyEditor] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageClick = async () => {};
  const onSubmitComment = async () => {
    console.log(editorValue);
  };
  const onCommentEditorChange = (html) => {
    if (
      html.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
      !html.includes("<img")
    ) {
      // Empty editor
      setIsDirtyEditor(false);
    } else {
      // Not empty editor
      setEditorValue(html);
      setIsDirtyEditor(true);
    }
  };
  const handleOnActiveCommentEditor = () => {
    setShowCommentEditor(!showCommentEditor);
  };
  return (
    <div className="py-[60px] px-48 mt-4">
      <h1 className="text-xl font-bold">Hỏi đáp (0)</h1>
      <h2 className="text-sm indent italic mt-2">
        (Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé)
      </h2>
      <div
        className={`mt-8 flex gap-4 ${
          !showCommentEditor ? "items-center" : ""
        } w-full`}
      >
        <Avatar
          src="https://i.pinimg.com/originals/2f/70/d3/2f70d3f60387739c111fd312e6dddae2.jpg"
          alt="avatar"
        ></Avatar>
        {!showCommentEditor ? (
          <div
            className="cursor-text text-slate-500 font-light w-full"
            onClick={handleOnActiveCommentEditor}
          >
            Bạn có thắc mắc gì trong bài học này
            <div className="h-[0.5px] w-full bg-slate-400"></div>
          </div>
        ) : (
          <div>
            <BasicEditor
              value={editorValue}
              onChange={onCommentEditorChange}
            ></BasicEditor>
            <div className="mt-4 flex justify-end gap-4">
              <BasicButton
                onClick={handleOnActiveCommentEditor}
                className="!bg-none !bg-white"
              >
                <strong className="text-gray-500">Hủy</strong>
              </BasicButton>
              <BasicButton onClick={onSubmitComment} disabled={!isDirtyEditor}>
                <strong>Bình luận</strong>
              </BasicButton>
            </div>
          </div>
        )}
      </div>
      <div className="mt-12 flex flex-col gap-8">
        <PaginatedCommentList
          itemsPerPage={10}
          listComment={listComment}
          pageCount={pageCount}
          handlePageClick={handlePageClick}
          isLoading={isLoading}
        ></PaginatedCommentList>
      </div>
    </div>
  );
};
