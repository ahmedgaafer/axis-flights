import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./index.scss";

type TPaginationProps = {
	pageCount: number;
};

const pageSizes = [1, 5, 10, 25, 50, 100];
const defaultSize = 10;

const defaultPage = 1;

const Pagination = ({ pageCount }: TPaginationProps) => {
	const [searchParams, setSearchParams] = useSearchParams();

	// this could be better. generalize the effect => put it in a more global setting.
	let page = searchParams.get("page") || `${defaultPage}`;
	let size = searchParams.get("size") || `${defaultSize}`;

	useEffect(() => {
		if (!pageSizes.includes(parseInt(size))) {
			size = defaultSize.toString();
			setSearchParams({
				size: size,
				page: page,
			});

			toast.error(`Size must be one of ${pageSizes.toString()}`);
		}

		if (!/^\d+$/.test(page)) {
			page = defaultPage.toString();
			setSearchParams({
				size: size,
				page: page,
			});

			toast.error(`Page must be a number`);
		}

		if (parseInt(page) > pageCount) {
			console.log(pageCount);
			page = defaultPage.toString();
			setSearchParams({
				size: size,
				page: page,
			});

			toast.error(`Page must be less than or equal to ${pageCount}`);
		}
	}, [page, size]);

	const handleClick = (e: any, size: number = -1) => {
		const selectedPage = e.selected + 1;

		setSearchParams({
			size: size >= 0 ? size.toString() : (searchParams.get("size") as string),
			page: selectedPage,
		});
	};

	return (
		<div className="pagination">
			<span className="pagination-pages">
				<p>Page: </p>
				<ReactPaginate
					breakLabel="..."
					nextLabel=" >"
					onPageChange={handleClick}
					marginPagesDisplayed={1}
					pageRangeDisplayed={1}
					pageCount={pageCount}
					previousLabel="<"
					renderOnZeroPageCount={null}
					forcePage={
						searchParams.get("page")
							? parseInt(searchParams.get("page") as string) - 1
							: 0
					}
				/>
			</span>
			<span className="pagination-size">
				<p>Size: </p>
				<select
					value={searchParams.get("size") as string}
					onChange={(e) => {
						handleClick({ selected: 0 }, parseInt(e.target.value));
					}}
				>
					{pageSizes.map((size) => (
						<option key={size} value={size}>
							{size}
						</option>
					))}
				</select>
			</span>
		</div>
	);
};

export default Pagination;
