import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Pagination } from '@/utils/pagination';

export interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize?: number;
  rollPage?: number;
  pageUrl?: string;
}

export default memo(
  ({
    total,
    currentPage,
    pageSize = 10,
    rollPage = 5,
    pageUrl = '#',
  }: PaginationProps) => {
    const getPageUrl = (val: number) => {
      return pageUrl.replace('{page}', val.toString());
    };

    const page = new Pagination({
      total: total,
      currentPage: currentPage,
      pageSize: pageSize,
      rollPage: rollPage,
    });

    const [ps, setPs] = useState({
      pages: page.getPages(),
      prePage: page.prePage,
      nextPage: page.nextPage,
      isPrePage: page.isPrePage,
      isNextPage: page.isNextPage,
    });

    const setCurrentPage = (val: number) => {
      page.setPage(val);
      setPs({
        pages: page.getPages(),
        prePage: page.prePage,
        nextPage: page.nextPage,
        isPrePage: page.isPrePage,
        isNextPage: page.isNextPage,
      });
    };

    useEffect(() => {
      setCurrentPage(currentPage);
    }, [currentPage]);

    return ps.isNextPage || ps.isPrePage ? (
      <ul className="ant-pagination">
        {ps.isPrePage && (
          <li
            title="上一页"
            className="ant-pagination-prev"
            aria-disabled="false"
          >
            <Link to={getPageUrl(ps.prePage)}>
              <button className="ant-pagination-item-link" type="button">
                <span
                  role="img"
                  aria-label="left"
                  className="anticon anticon-left"
                >
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="left"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                  </svg>
                </span>
              </button>
            </Link>
          </li>
        )}

        {ps.pages.map(item => (
          <li
            key={item}
            title={item.toString()}
            className={classnames(
              'ant-pagination-item',
              `ant-pagination-item-${item}`,
              { 'ant-pagination-item-active': currentPage === item }
            )}
          >
            {currentPage !== item ? (
              <Link to={getPageUrl(item)} rel="nofollow">
                {item}
              </Link>
            ) : (
              <a rel="nofollow">{item}</a>
            )}
          </li>
        ))}

        {ps.isNextPage && (
          <li
            title="下一页"
            className="ant-pagination-next"
            aria-disabled="false"
          >
            <Link to={getPageUrl(ps.nextPage)}>
              <button className="ant-pagination-item-link" type="button">
                <span
                  role="img"
                  aria-label="right"
                  className="anticon anticon-right"
                >
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="right"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                  </svg>
                </span>
              </button>
            </Link>
          </li>
        )}
      </ul>
    ) : (
      <></>
    );
  }
);
