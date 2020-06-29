import moment from 'moment';
import { IUser } from '../../api/auth/models/User';

export const formatDate = (date: Date, format: string) => {
  return moment(date).format(format);
};

export const truncate = (str: string, len: number) => {
  if (str.length > len && str.length > 0) {
    let new_str = str + ' ';
    new_str = str.substr(0, len);
    new_str = str.substr(0, new_str.lastIndexOf(' '));
    new_str = new_str.length > 0 ? new_str : str.substr(0, len);
    return new_str + '...';
  }
  return str;
};

export const stripTags = (input: string) => {
  return input.replace(/<(?:.|\n)*?>/gm, '');
};

export const editIcon = (
  storyAuthor: IUser,
  loggedUser: IUser,
  storyId: string,
  floating = true
) => {
  if (storyAuthor._id.toString() == loggedUser._id.toString()) {
    if (floating) {
      return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
    } else {
      return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
    }
  } else {
    return '';
  }
};

export const select = (selected, options) => {
  return options
    .fn(this)
    .replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"')
    .replace(
      new RegExp('>' + selected + '</option>'),
      ' selected="selected"$&'
    );
};
