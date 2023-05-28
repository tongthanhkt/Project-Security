import IconButton from "../../../../../components/button/IconButton";
import BasicSearch from "../../../../../components/search/BasicSearch";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import { searchTA } from "../../../../../utils/taHepler";

export const AssignTAContent = ({
  listSelectedTA,
  setListSelectedTA,
  onListSelectedTAChange = () => {},
}) => {
  const data = [
    {
      name: "Đỗ Đình Văn",
      email:
        "dinhvan3111@gmail.com fqwfkqwfjklw kfqw jklfqwk kfqwlk jlfqwjkl jklwqj",
      thumbUrl:
        "https://img1.ak.crunchyroll.com/i/spire2/66f7eb6bdb673d6ee449c11c580750681652905726_full.png",
    },
    {
      name: "Đỗ Đình Văn",
      email: "dinhvan3111@gmail.com",
      thumbUrl:
        "https://img1.ak.crunchyroll.com/i/spire2/66f7eb6bdb673d6ee449c11c580750681652905726_full.png",
    },
    {
      name: "Đỗ Đình Văn",
      email: "dinhvan3111@gmail.com",
      thumbUrl:
        "https://img1.ak.crunchyroll.com/i/spire2/66f7eb6bdb673d6ee449c11c580750681652905726_full.png",
    },
    {
      name: "Đỗ Đình Văn",
      email: "dinhvan3111@gmail.com",
      thumbUrl:
        "https://img1.ak.crunchyroll.com/i/spire2/66f7eb6bdb673d6ee449c11c580750681652905726_full.png",
    },
    {
      name: "Đỗ Đình Văn",
      email: "dinhvan3111@gmail.com",
      thumbUrl:
        "https://img1.ak.crunchyroll.com/i/spire2/66f7eb6bdb673d6ee449c11c580750681652905726_full.png",
    },
  ];
  const onSearchTA = async (value) => {
    const res = await searchTA(value);
    setSearchResult(res);
  };
  const [searchResult, setSearchResult] = useState([]);
  const handleOnRemoveTA = (ta) => {
    const listSelectedTAAfter = listSelectedTA.filter((item) => item !== ta);
    setListSelectedTA([...listSelectedTAAfter]);
    onListSelectedTAChange();
  };
  const handleSearchItemClick = (item) => {
    console.log(item);
    const found = listSelectedTA.some((element) => element.name === item.name);
    // Nếu đã tồn tại thì không thêm
    if (found) return;
    setListSelectedTA([item, ...listSelectedTA]);
    onListSelectedTAChange();
  };
  const searchResultItemBuilder = (item) => (
    <div
      key={item._id}
      className="p-2 flex justify-start items-center gap-4 cursor-pointer hover:bg-slate-100"
      onClick={() => handleSearchItemClick(item)}
    >
      <img
        className="rounded-full w-16 h-16 object-cover"
        src={item.thumbUrl ? item.thumbUrl : "/images/user.png"}
        alt="thumbUrl"
      />
      <div>
        <h1 className="font-semibold">{item.name}</h1>
        <h2 className="text-slate-500 truncate max-w-[250px]">{item.email}</h2>
      </div>
    </div>
  );
  return (
    <>
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="text-center">
          <h1 className="text-lg font-bold">
            Danh sách những TA sẽ phụ trách khoá học ({listSelectedTA?.length})
          </h1>
          <h3 className="text-lg text-slate-500">
            Thêm/xoá những tài khoản TA sẽ phụ trách khoá này
          </h3>
        </div>
        <BasicSearch
          className="lg:w-[400px] md:w-[300px] sm:w-[250px]"
          dropdownWrapperClassName="max-h-[405px] overflow-y-auto"
          title="Nhập email của TA ..."
          onChange={onSearchTA}
          showResultDropdown={true}
          dropdownData={searchResult}
          itemBuilder={searchResultItemBuilder}
        ></BasicSearch>
        <div className="list-selected-ta px-6 py-4 rounded-sm bg-slate-200 w-2/3">
          {listSelectedTA.length !== 0 ? (
            <div className="bg-white max-h-[400px] overflow-y-auto rounded-sm shadow-sm">
              {listSelectedTA.map((item) => (
                <div
                  key={item._id}
                  className="p-4 flex justify-between items-center border-y border-slate-200"
                >
                  <div className="flex items-center gap-4">
                    <img
                      className="w-16 h-16 rounded-full object-cover"
                      src={item.thumbUrl ? item.thumbUrl : "/images/user.png"}
                      alt="avatar"
                    />
                    <div>
                      <h1 className="max-w-[300px] font-semibold text-ellipsis overflow-hidden">
                        {item.name}
                      </h1>
                      <h2 className="max-w-[300px] text-slate-500 truncate overflow-hidden">
                        {item.email}
                      </h2>
                    </div>
                  </div>
                  <IconButton
                    className="!rounded-full h-10 w-10"
                    onClick={() => handleOnRemoveTA(item)}
                  >
                    <ClearIcon></ClearIcon>
                  </IconButton>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400 font-semibold">
              Chưa có người nào phụ trách khoá học này
            </div>
          )}
        </div>
      </div>
    </>
  );
};
