import { Brick, BrickStatus } from 'model/brick';
import { SortBy, Filters, ThreeColumns } from './model';

const getBrickById = (bricks: Brick[], brickId: number) => {
  return bricks.find(b => b.id === brickId);
}

export const removeBrickFromList = (bricks: Brick[], brickId: number) => {
  let brick = getBrickById(bricks, brickId);
  if (brick) {
    let index = bricks.indexOf(brick);
    if (index >= 0) {
      bricks.splice(index, 1);
    }
  }
}

export const removeBrickFromLists = (rawBricks: Brick[], finalBricks: Brick[], threeColumns: ThreeColumns, brickId: number) => {
  removeBrickFromList(finalBricks, brickId);
  removeBrickFromList(rawBricks, brickId);

  const { publish, draft, review } = threeColumns;
  removeBrickFromList(publish.finalBricks, brickId);
  removeBrickFromList(publish.rawBricks, brickId);
  removeBrickFromList(draft.finalBricks, brickId);
  removeBrickFromList(draft.rawBricks, brickId);
  removeBrickFromList(review.finalBricks, brickId);
  removeBrickFromList(review.rawBricks, brickId);
}

export const removeInboxFilters = (filters: Filters) => {
  filters.viewAll = false;
  filters.buildAll = false;
  filters.editAll = false;
}

export const filterByStatus = (bricks: Brick[], status: BrickStatus) => {
  return bricks.filter(b => b.status === status);
}

export const filterByCurretUser = (bricks: Brick[], userId: number) => {
  return bricks.filter(b => b.author.id === userId);
}

export const filterByPrivate = (bricks: Brick[], userId: number, generalSubjectId: number) => {
  return bricks.filter(b => b.author.id === userId || b.subjectId === generalSubjectId);
}

export const filterByCore = (bricks: Brick[], generalSubjectId: number) => {
  return bricks.filter(b => b.subjectId !== generalSubjectId);
}

export const filterBricks = (filters: Filters, rawBricks: Brick[], userId: number, generalSubjectId: number): Brick[] => {
  let filteredBricks: Brick[] = [];
  let bricks = Object.assign([], rawBricks) as Brick[];

  if (!filters.isCore) {
    bricks = filterByPrivate(bricks, userId, generalSubjectId);
  } else {
    bricks = filterByCore(bricks, generalSubjectId);
  }

  if (filters.draft) {
    filteredBricks.push(...filterByStatus(bricks, BrickStatus.Draft));
  }
  if (filters.build) {
    filteredBricks.push(...filterByStatus(bricks, BrickStatus.Build));
  }
  if (filters.review) {
    filteredBricks.push(...filterByStatus(bricks, BrickStatus.Review));
  }
  if (filters.publish) {
    filteredBricks.push(...filterByStatus(bricks, BrickStatus.Publish));
  }

  if (!filters.draft && !filters.build && !filters.review && !filters.publish) {
    return bricks;
  }
  return filteredBricks;
}

export const sortByDate = (a: Brick, b: Brick) => {
  const createdA = new Date(a.updated).getTime();
  const createdB = new Date(b.updated).getTime();
  return createdA > createdB ? 1 : -1;
}

export const sortByStatus = (a: Brick, b: Brick) => a.status > b.status ? 1 : -1;

export const sortByPopularity = (a: Brick, b: Brick) => a.attemptsCount > b.attemptsCount ? 1 : -1;

export const sortBricks = (bricks: Brick[], sortBy: SortBy) => {
  let finalBricks = Object.assign([], bricks) as Brick[];
  if (sortBy === SortBy.Date) {
    finalBricks = finalBricks.sort(sortByDate);
  } else if (sortBy === SortBy.Status) {
    finalBricks = finalBricks.sort(sortByStatus);
  } else if (sortBy === SortBy.Popularity) {
    finalBricks = finalBricks.sort(sortByPopularity);
  }
  return finalBricks;
}

export const hideAllBricks = (bricks: Brick[]) => bricks.forEach(b => b.expanded = false);

export const expandBrick = (bricks: Brick[], allBricks: Brick[], index: number) => {
  hideAllBricks(allBricks);
  if (!bricks[index].expandFinished) {
    bricks[index].expanded = true;
  }
}

export const clearStatusFilters = (filters: Filters) => {
  filters.draft = false;
  filters.build = false;
  filters.review = false;
  filters.publish = false;
}

export const removeAllFilters = (filters: Filters) => {
  filters.viewAll = false;
  filters.buildAll = false;
  filters.editAll = false;
  clearStatusFilters(filters);
}

export const prepareVisibleBricks = (sortedIndex: number, pageSize: number, bricks: Brick[]) => {
  let data: any[] = [];
  let count = 0;
  for (let i = 0 + sortedIndex; i < pageSize + sortedIndex; i++) {
    const brick = bricks[i];
    if (brick) {
      let row = Math.floor(count / 3);
      data.push({ brick, key: i, index: count, row });
      count++;
    }
  }
  return data;
}
