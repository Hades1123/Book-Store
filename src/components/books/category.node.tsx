import type { ICategoryRes } from '@/types/book';
import '@/pages/book/book.page.scss';

export const CategoryNode = ({
  category,
  isChild = false,
  currentCategory,
  handleClickCategory,
}: {
  category: ICategoryRes;
  isChild?: boolean;
  currentCategory: string | null;
  handleClickCategory: (data: { id: string; label: string }) => void;
}) => {
  return (
    <div className={`${isChild ? 'book__category-child' : 'book__category-parent'} `}>
      <span
        className={`${category.id === currentCategory ? 'book__category--active' : ''}`}
        onClick={() => handleClickCategory({ id: category.id, label: category.name })}
      >
        {category.name}
      </span>
      {category.children && (
        <div className="book__subcategory-list">
          {category.children.map((item) => (
            <CategoryNode
              currentCategory={currentCategory}
              handleClickCategory={handleClickCategory}
              category={item}
              key={item.id}
              isChild={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
