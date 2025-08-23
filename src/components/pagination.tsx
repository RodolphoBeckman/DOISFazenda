
"use client"

import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "./ui/button";

interface PaginationComponentProps {
    pageCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

export function PaginationComponent({ 
    pageCount, 
    currentPage, 
    onPageChange,
    siblingCount = 1 
}: PaginationComponentProps) {
    const paginationRange = React.useMemo(() => {
        const totalPageNumbers = siblingCount + 5; 

        if (totalPageNumbers >= pageCount) {
            return Array.from({ length: pageCount }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, pageCount);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < pageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = pageCount;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, -1, pageCount];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => pageCount - rightItemCount + i + 1);
            return [firstPageIndex, -1, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = [];
            for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                middleRange.push(i);
            }
            return [firstPageIndex, -1, ...middleRange, -1, lastPageIndex];
        }
        return []; 
    }, [pageCount, currentPage, siblingCount]);

    if (pageCount <= 1) {
        return null;
    }
  
    const onNext = () => {
        if (currentPage < pageCount) {
            onPageChange(currentPage + 1);
        }
    };

    const onPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Button 
                        variant="ghost" 
                        onClick={onPrevious} 
                        disabled={currentPage === 1}
                        className="gap-1 pl-2.5"
                    >
                        <PaginationPrevious className="h-4 w-4" />
                        <span className="sr-only">Anterior</span>
                    </Button>
                </PaginationItem>
                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === -1) {
                        return <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>;
                    }
                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink 
                                href="#"
                                isActive={currentPage === pageNumber}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(pageNumber);
                                }}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                <PaginationItem>
                    <Button 
                        variant="ghost" 
                        onClick={onNext} 
                        disabled={currentPage === pageCount}
                        className="gap-1 pr-2.5"
                    >
                        <span className="sr-only">Próximo</span>
                        <PaginationNext className="h-4 w-4" />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

    