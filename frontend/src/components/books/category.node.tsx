import { memo } from 'react';
import type { ICategoryRes } from '@/types/book';
import '@/pages/book/book.page.scss';

export const CategoryNode = memo(
  ({
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
    const curr = isNaN(Number(currentCategory)) ? currentCategory?.split(',') : currentCategory;
    return (
      <div className={`${isChild ? 'book__category-child' : 'book__category-parent'} `}>
        <span
          className={`${category.id == (Array.isArray(curr) ? curr[curr.length - 1] : curr) ? 'book__category--active' : ''}`}
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
  }
);