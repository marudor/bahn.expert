import { Body, Controller, Get, Post, Query, Route, Tags } from 'tsoa';
import { SubscribeCreate } from 'server/HAFAS/Subscribe/Create';
import { SubscribeDelete } from 'server/HAFAS/Subscribe/Delete';
import { SubscribeDetails } from 'server/HAFAS/Subscribe/Details';
import { SubscribeSearch } from 'server/HAFAS/Subscribe/Search';
import { SubscribeUserCreate } from 'server/HAFAS/Subscribe/UserCreate';
import { SubscribeUserDelete } from 'server/HAFAS/Subscribe/UserDelete';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
  ParsedSubscrCreateResponse,
  SubscrCreateOptions,
} from 'types/HAFAS/Subscr/SubscrCreate';
import type {
  ParsedSubscrUserResponse,
  SubscrUserCreateOptions,
} from 'types/HAFAS/Subscr/SubscrUserCreate';
import type {
  SubscrDeleteOptions,
  SubscrDeleteResponse,
} from 'types/HAFAS/Subscr/SubscrDelete';
import type { SubscrDetailsResponse } from 'types/HAFAS/Subscr/SubscrDetails';
import type { SubscrSearchResponse } from 'types/HAFAS/Subscr/SubscrSearch';
import type {
  SubscrUserDeleteOptions,
  SubscrUserDeleteResponse,
} from 'types/HAFAS/Subscr/SubscrUserDelete';

@Route('/hafas/subscribe')
export class HafasSubscribeController extends Controller {
  @Post('/create')
  @Tags('HAFAS Subscribe')
  create(
    @Body() body: SubscrCreateOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedSubscrCreateResponse> {
    return SubscribeCreate(body, profile);
  }

  @Post('/delete')
  @Tags('HAFAS Subscribe')
  delete(
    @Body() body: SubscrDeleteOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<SubscrDeleteResponse> {
    return SubscribeDelete(body, profile);
  }

  @Post('/createUser')
  @Tags('HAFAS Subscribe')
  createUser(
    @Body() body: SubscrUserCreateOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedSubscrUserResponse> {
    return SubscribeUserCreate(body, profile);
  }

  @Get('/search')
  @Tags('HAFAS Subscribe')
  search(
    @Query() userId: string,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<SubscrSearchResponse> {
    return SubscribeSearch(
      {
        userId,
      },
      profile,
    );
  }

  @Post('/deleteUser')
  @Tags('HAFAS Subscribe')
  deleteUser(
    @Body() body: SubscrUserDeleteOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<SubscrUserDeleteResponse> {
    return SubscribeUserDelete(body, profile);
  }

  @Get('/details')
  @Tags('HAFAS Subscribe')
  details(
    @Query() userId: string,
    @Query() subscribeId: number,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<SubscrDetailsResponse> {
    return SubscribeDetails(
      {
        userId,
        subscrId: subscribeId,
      },
      profile,
    );
  }
}
