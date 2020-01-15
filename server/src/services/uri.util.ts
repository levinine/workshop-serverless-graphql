export class URIUtil {
  public static DEFAULT_IMAGE_WRITE_FORMAT = 'jpeg';
  public static TRANSPARENCY_PREFIX = '/transparent';
  public static BLUR_PREFIX = '/blur-';

  public static extractParams(uri: string) {
    const regEx = /(\d+)x(\d+)/;
    const splitted = uri.split(regEx);

    const [actionPathParams, width, height, imagePath] = splitted;

    let imageProcessingParams: any = {};
    imageProcessingParams.width = +width;
    imageProcessingParams.height = +height;

    if (actionPathParams && actionPathParams !== '/') {
      imageProcessingParams = {
        ...imageProcessingParams,
        ...URIUtil.extractActionParams(actionPathParams),
      };
    }

    imageProcessingParams.imageId = imagePath.slice(1);
    imageProcessingParams.writeFormat = URIUtil.DEFAULT_IMAGE_WRITE_FORMAT;

    return imageProcessingParams;
  }

  private static extractActionParams(
    actionPathParams: string,
  ): any {
    const actionParams = new ProcessingActionParams();

    if (actionPathParams.startsWith(URIUtil.TRANSPARENCY_PREFIX)) {
      actionParams.shouldHaveTransparentPixels = true;
      actionPathParams = actionPathParams.slice(URIUtil.TRANSPARENCY_PREFIX.length);
    }

    if (actionPathParams.startsWith(URIUtil.BLUR_PREFIX)) {
      const blurPrefixLength = URIUtil.BLUR_PREFIX.length;
      const pathParams = actionPathParams.slice(1).split('/');
      const blurRadius = pathParams[0].slice(blurPrefixLength - 1);
      actionParams.blur = +blurRadius;
      const blurLength = blurPrefixLength + blurRadius.length;
      actionPathParams = actionPathParams.slice(blurLength);
    }

    const actionParamsSplit = actionPathParams.slice(1).split('/');
    if (actionParamsSplit[0]) {
      actionParams.prefix = actionParamsSplit[0] as ActionPrefix;
    }

    if (actionParamsSplit[1]) {
      const focalPointSplit = actionParamsSplit[1].split('-');

      actionParams.focalPoint = {
        x: +focalPointSplit[0] / 100,
        y: +focalPointSplit[1] / 100,
      };
    }

    return actionParams;
  }
}
