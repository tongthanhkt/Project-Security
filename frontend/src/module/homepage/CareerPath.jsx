import React from "react";
import uuid from "react-uuid";
import VerticalProgress from "../../components/progress/VerticalProgress";
import BasicTitle from "../../components/title/BasicTitle";

const careers = [
  {
    title: "Fresher - Sinh viên mới ra trường",
    description:
      "Fresher là những người đã trang bị đầy đủ kiến thức căn bản cần có, kiến thức về các logic, cấu trúc phần mềm, cơ sở dữ liệu… Và cần một môi trường để thực hiện, triển khai, học hỏi và phát triển lên các kỹ năng chính và kỹ năng mềm.",
  },
  {
    title: "Junior Developer - 0 đến 2 năm kinh nghiệm",
    description:
      "Thường là người trải qua giai đoạn intern và fresher, đã có kinh nghiệm trong việc lập trình ứng dụng trên thực tế. Hiểu biết sơ bộ về toàn bộ một vòng đời ứng dụng, sử dụng ngôn ngữ lập trình hay framework. Hiểu biết về cơ sở dữ liệu, lưu trữ và xuất dữ liệu. Lúc này có thể viết các chức năng cho ứng dụng, tuy nhiên code sẽ có rác nhiều do chưa có kinh nghiệm tối ưu dẫn để việc chồng chéo trong việc truy xuất dữ liệu. Lúc này đôi khi code dở sẽ dẫn đến tốn resource server rất nhiều.",
  },
  {
    title: "Senior Developer - 3 đến 8+ năm kinh nghiệm lập trình",
    description:
      "Có thể xử lý các vấn đề phức tạp, viết ứng dụng lớn. Có khả năng thiết kế các cấu trúc cơ sở dữ liệu lớn, các tính năng phức tạp của ứng dụng. Hiểu biết sâu sắc về cơ sở dữ liệu và các dịch vụ ứng dụng (queues, caching, v.v…). Lập trình viên ở level senior là những người thực sự quan trọng trong việc xây dựng toàn bộ các ứng dụng ở quy mô lớn. Lên đến level này, bạn sẽ đứng trước hai hướng đi của sự nghiệp. Một là khi bạn hiểu công nghệ đủ để trở thành một lập trình viên senior, thì bạn có thể đã có những kinh nghiệm kỹ thuật đủ sâu để trở thành một technical leader hoặc CTO (Giám đốc công nghệ) của một startup.",
  },
  {
    title: "Tech lead - 5 đến 10+ năm kinh nghiệm lập trình",
    description:
      "Có các kỹ năng của một senior. Hiểu đủ sâu và rộng về các công nghệ, chọn cho team dev một hay nhiều tech stack để giải quyết vấn đề trong hệ thống lớn. Đến level này, bạn sẽ có rất nhiều quyết định quan trọng để mọi lập trình viên trong team đi theo, nào là chọn ngôn ngữ gì, chọn tools gì, thiết kế hệ thống ra sao, theo chuẩn quy trình làm phần mềm nào. Lúc này có đôi khi bạn sẽ code những định nghĩa, những quy luật đặt biến chẳng hạn, tuy nhiên công việc chính thường là thiết kế hệ thống va đảm bảo hệ thống có thể scale lớn, có thể kết hợp nhiều tech stack để vận hành đáp ứng nhu cầu.",
  },
  {
    title: "Product Manager hoặc Project Manager",
    description:
      "Là người quyết định rất lớn đế những chức năng cần phải có của một sản phẩm thông qua nghiên cứu, khảo sát và đo đạc. Sau hàng năm trời còng lưng ra code bạn đã cảm thấy vị trí của mình trở nên nhàm chán và công việc quá nặng nề. Trong khi bạn bị việc rượt đuổi thì PM của bạn suốt ngày đi vòng quanh hối thúc. Bạn cảm thấy stress và bất công, bạn nghĩ nếu PM là “người đi hối” thì bạn cũng làm được. “Phải trở thành PM ngày bây giờ mới được!” – Bạn quyết tâm như vậy.",
  },

  {
    title: "CTO hoặc CEO - Quản lý cao cấp",
    description:
      "Đến lúc này bạn sẽ trở thành một người truyền cảm hứng, dẫn dắt các leader và team đi theo một vision nào đó. Bạn ở nấc thang sự nghiệp đỉnh cao này, thì bạn càng ít tiếp xúc với công việc lập trình. Điều quan trọng nhất lúc này là về con người. Các nhà quản lý cấp trung (mid-level manager) vẫn có thể có thời gian để vọc vạch với công nghệ, nhưng các quản lý cấp cao phải dành tất cả thời gian của họ để tập trung vào vấn đề con người: truyền cảm hứng, tạo động lực, lãnh đạo, và ra chiến lược",
  },
];

const CareerItem = ({ position = 1, title = "", description = "" }) => {
  return (
    <div className="career flex gap-8 items-center mx-auto">
      <div className="w-16 h-16 rounded-full bg-[#ECEDF5] flex items-center justify-center font-bold text-[#192355] text-[18px] z-10">
        {position}
      </div>
      <div className="text-[#192335]   px-8 py-6 bg-[#ECEDF5] rounded-lg w-[600px] career__info">
        <h4 className="career__title font-semibold text-[18px]">{title}</h4>
        <p className="text-sm font-semibold text-gray-600  career__description hidden slip">
          {description}
        </p>
      </div>
    </div>
  );
};

const CareerList = ({ careers }) => {
  return (
    <div className="relative">
      {/* <VerticalProgress className="absolute h-full left-[132px] " /> */}

      <div className="flex flex-col gap-6 mt-12 ml-28">
        {careers.map((career, index) => (
          <CareerItem
            key={uuid()}
            position={index + 1}
            title={career.title}
            description={career.description}
          />
        ))}
      </div>
    </div>
  );
};

const CareerPath = () => {
  return (
    <div id="st4" className="wrapper my-12">
      <BasicTitle>Lộ trình phát triển của lập trình viên</BasicTitle>
      <CareerList careers={careers} />
    </div>
  );
};

export default CareerPath;
